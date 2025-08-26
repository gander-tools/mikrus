import { Command } from "@cliffy/command";
import { ensureDir } from "@std/fs";
import { dirname, join } from "@std/path";
import { utils, validateAndSanitizeInput } from "../utils.ts";

/**
 * Template generation function using Deno APIs
 */
async function generateFromTemplate(props: {
  template: string;
  target: string;
  name: string;
}): Promise<void> {
  try {
    // Read template file
    const templatePath = join("src", "templates", props.template);
    const templateContent = await Deno.readTextFile(templatePath);

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
