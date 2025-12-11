const { google } = require("googleapis");

async function testAccess() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "./firebase_credentials.json",
        scopes: ["https://www.googleapis.com/auth/drive"]
    });

    const drive = google.drive({ version: "v3", auth });

    const res = await drive.files.list({
        q: "'130daLUamP1Z1hya6i0kndQhGrYOK9jEO' in parents",
        fields: "files(id, name)"
    });

    console.log(res.data.files);
}

testAccess();
