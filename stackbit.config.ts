import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";
import type { SiteMapEntry } from "@stackbit/types"; // Type-only import

// Define the Stackbit configuration
export default defineStackbitConfig({
  stackbitVersion: "0.1.0", // Specify the version of Stackbit you are using
  contentSources: [
    new GitContentSource({
      rootPath: __dirname, // The root directory of your project
      contentDirs: ["src/content"], // Directory where your content files are stored
      models: [
        {
          name: "Page",
          type: "page", // Define the model as a page model
          urlPath: "/{slug}", // URL path structure for pages
          filePath: "src/content/pages/{slug}.json", // File path for content files
          fields: [
            { name: "title", type: "string", required: true },
            { name: "subtitle", type: "string", required: false },
            { name: "image", type: "string", required: false },
            { name: "slug", type: "string", required: true } // Ensure slug field is defined
          ]
        },
        {
          name: "Post",
          type: "page", // Define as a page model for blog posts
          urlPath: "/posts/{slug}", // URL path structure for posts
          filePath: "src/content/posts/{slug}.json", // File path for post content
          fields: [
            { name: "title", type: "string", required: true },
            { name: "content", type: "text", required: true },
            { name: "slug", type: "string", required: true } // Ensure slug field is defined
          ]
        }
      ],
    })
  ],
  siteMap: ({ documents, models }) => {
    // 1. Filter all page models
    const pageModels = models.filter((m) => m.type === "page");

    return documents
      // 2. Filter all documents which are of a page model
      .filter((d) => pageModels.some(m => m.name === d.modelName))
      // 3. Map each document to a SiteMapEntry
      .map((document) => {
        // Ensure document.fields.slug is a string type
        const slugField = document.fields.slug;

        // Check if the slug field is of type string
        const slug = (typeof slugField === 'string') ? slugField : (slugField as unknown) as string;

        // Map the model name to its corresponding URL
        const urlModel = (() => {
          switch (document.modelName) {
            case 'Page':
              return slug; // Now guaranteed to be a string
            case 'Post':
              return `posts/${slug}`; // URLs for blog posts
            default:
              return null;
          }
        })();

        return {
          stableId: document.id,
          urlPath: `/${urlModel}`, // Construct the URL path
          document,
          isHomePage: slug === 'home', // Example: Mark home page if slug is 'home'
        };
      })
      .filter(Boolean) as SiteMapEntry[]; // Filter out any null values
  }
});