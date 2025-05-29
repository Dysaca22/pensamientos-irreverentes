const SHEETID = "1Q1U1PVQQ0gxLnVgQkx2YpqZX67N__P02Tn5E-gp_DDk";
const SHEETNAMES = {
    cities: "Ciudades",
    places: "Lugares",
}

function _readGoogleSheet(sheetId, sheetName) {
    return new Promise((resolve, reject) => {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((data) => {
                const jsonData = JSON.parse(data.substring(47).slice(0, -2));
                const headers = jsonData.table.cols.map((col) => col.label);
                const rows = jsonData.table.rows
                    .map((row) => {
                        const rowData = {};
                        row.c.forEach((cell, index) => {
                            rowData[headers[index]] = cell ? cell.v : "";
                        });
                        return rowData;
                    })
                    .filter((row) =>
                        Object.values(row).some((value) => value !== "")
                    );
                resolve(rows);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                reject(error);
            });
    });
}

export async function getCities() {
    return await _readGoogleSheet(SHEETID, SHEETNAMES.cities);
}

export async function getPlacesByCity(cityID) {
    const places = await _readGoogleSheet(SHEETID, SHEETNAMES.places);
    return places.filter((place) => place.id_ciudad === cityID);
}

export async function getLastPlacesAdded() {
    const places = await _readGoogleSheet(SHEETID, SHEETNAMES.places);
    return places.slice(-5).reverse();
}