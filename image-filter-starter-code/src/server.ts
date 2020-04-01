import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  app.get("/filteredimage/", async (req: Request, res: Response) => {
    let { image_url } = req.query;

    // validate query parameter
    if (!image_url) {
      return res.status(400).send(`image_url is required`);
    }

    // filter image
    const filteredImagePath = await filterImageFromURL(image_url);

    // delete file on finish of the response
    res.on("finish", () => deleteLocalFiles([filteredImagePath]));

    //send filtered file
    res.status(200).sendFile(filteredImagePath);
    res.end;

    return;
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
