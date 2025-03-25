import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function registerViteDevServer(app: Express): Promise<void> {
  const serverOptions = {
    middlewareMode: true as const,
    hmr: true,
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
    allowedHosts: true as const,
  };

  try {
    const vite = await createViteServer({
      ...viteConfig,
      configFile: false,
      customLogger: {
        ...viteLogger,
        error: (msg, options) => {
          viteLogger.error(msg, options);
          console.error(`Vite server error: ${msg}`);
        },
      },
      server: serverOptions,
      appType: "custom",
    });

    // Usa i middleware di Vite
    app.use(vite.middlewares);

    // Gestisci tutte le altre richieste con Vite
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;

      try {
        const clientTemplate = path.resolve(
          __dirname,
          "..",
          "client",
          "index.html",
        );

        // Ricarica sempre il file index.html dal disco nel caso cambi
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        template = template.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`,
        );
        const page = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });

    console.log("✅ Vite dev server configurato con successo!");
  } catch (error) {
    console.error("Errore nell'inizializzazione del server Vite:", error);
    throw error;
  }
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "dist", "client");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Impossibile trovare la directory di build: ${distPath}, assicurati di compilare il client prima`,
    );
  }

  app.use(express.static(distPath));

  // Reindirizza tutte le richieste non riconosciute a index.html per il routing SPA
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
