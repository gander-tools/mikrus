import { Command } from "@cliffy/command";
import { ensureDir } from "@std/fs";
import { dirname, fromFileUrl, join } from "@std/path";
import { utils, validateAndSanitizeInput } from "../utils.ts";

// Embedded template content for compiled binary compatibility
const MODEL_TEMPLATE = `export interface <%= name %>Model {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class <%= name %>Service {
  private models: <%= name %>Model[] = [];

  create(name: string): <%= name %>Model {
    const model: <%= name %>Model = {
      id: Date.now(),
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

  findById(id: number): <%= name %>Model | undefined {
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
  .action(async (_options, name: string) => {
    try {
      // Validate and sanitize the input
      const validName = validateAndSanitizeInput(name);

      // Generate the file using template
      await generateFromTemplate({
        template: "model.ts.ejs",
        target: `models/${validName}-model.ts`,
        name: validName,
      });

      utils.success(`Generated file at models/${validName}-model.ts`);
    } catch (err) {
      utils.error(
        `Security validation failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  });
