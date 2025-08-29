import { Command } from "@cliffy/command";
import { ensureDir } from "@std/fs";
import { dirname } from "@std/path";
import { utils, validateAndSanitizeInput } from "../utils.ts";

// Embedded template content for compiled binary compatibility
const MODEL_TEMPLATE = `export interface <%= name %>Model {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class <%= name %>Service {
  private models: <%= name %>Model[] = [];

  create(name: string): <%= name %>Model {
    const model: <%= name %>Model = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.models.push(model);
    return model;
  }

  findAll(): <%= name %>Model[] {
    return this.models;
  }

  findById(id: string): <%= name %>Model | undefined {
    return this.models.find(model => model.id === id);
  }
}
`;

/**
 * Template generation function using embedded templates for binary compatibility
 */
async function generateFromTemplate(props: {
  template: string;
  target: string;
  name: string;
}): Promise<void> {
  try {
    // Get template content - use embedded template for compiled binary compatibility
    let templateContent: string;

    if (props.template === "model.ts.ejs") {
      templateContent = MODEL_TEMPLATE;
    } else {
      throw new Error(`Unknown template: ${props.template}`);
    }

    // Simple template replacement (similar to EJS but basic)
    // Replace <%= name %> with actual name value
    const generatedContent = templateContent.replace(
      /<%=\s*name\s*%>/g,
      props.name,
    );

    // Ensure target directory exists
    await ensureDir(dirname(props.target));

    // Write generated file
    await Deno.writeTextFile(props.target, generatedContent);
  } catch (error) {
    throw new Error(
      `Template generation failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/**
 * Generate command for Cliffy
 */
export const generateCommand = new Command()
  .description("Generate a new model file from template")
  .arguments("<name:string>")
  .alias("g")
  .example("Generate a user model", "mikrus generate user")
  .example("Generate with alias", "mikrus g user")
  .example("Generate a product model", "mikrus g product-item")
  .option(
    "--output, -o <path:string>",
    "Output directory for generated files",
    { default: "models" },
  )
  .option(
    "--template, -t <template:string>",
    "Template to use for generation",
    { default: "model.ts.ejs" },
  )
  .option(
    "--dry-run",
    "Show what would be generated without creating files",
  )
  .action(async (options, name: string) => {
    try {
      // Validate and sanitize the input
      const validName = validateAndSanitizeInput(name);

      // Determine output path with user option support
      const outputDir = options.output || "models";
      const templateName = options.template || "model.ts.ejs";
      const targetPath = `${outputDir}/${validName}-model.ts`;

      // Dry-run mode: show what would be generated
      if (options.dryRun) {
        console.log(`\n📋 Dry-run mode - no files will be created:`);
        console.log(`   Template: ${templateName}`);
        console.log(`   Target: ${targetPath}`);
        console.log(`   Name: ${validName}`);
        console.log(`\n✅ Dry-run completed successfully`);
        return;
      }

      // Generate the file using template
      await generateFromTemplate({
        template: templateName,
        target: targetPath,
        name: validName,
      });

      utils.success(`Generated file at ${targetPath}`);
    } catch (err) {
      utils.error(
        `Generation failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  });
