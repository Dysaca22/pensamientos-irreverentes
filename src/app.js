import "dotenv/config";
import express from "express";
import { filterLocations } from "./utils/data.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static("public"));

app.get("/api/locations", async (req, res) => {
    const { pais, ciudad } = req.query;
    const locations = await filterLocations(pais, ciudad);
    res.json(locations);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
