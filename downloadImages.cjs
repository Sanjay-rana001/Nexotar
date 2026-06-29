const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const imagesToDownload = [
  { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800", file: "grocery-store.jpg" },
  { url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800", file: "dietitian.jpg" },
  { url: "https://images.unsplash.com/photo-1716191300020-b52dec5b70a8?q=80&w=1170&auto=format&fit=crop", file: "sspi.jpg" },
  { url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800", file: "airlines.jpg" },
  { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800", file: "package-reservation.jpg" },
  { url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600", file: "neobank.jpg" },
  { url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600", file: "fitlife.jpg" },
  { url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600", file: "coffee.jpg" },
  { url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600", file: "creative.jpg" },
  { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600", file: "ecotech.jpg" },
  { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600", file: "luxury.jpg" },
  { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600", file: "ui-kit.jpg" },
  { url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600", file: "spotify.jpg" },
  { url: "https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&q=80&w=600", file: "web3.jpg" },
  { url: "https://ui-avatars.com/api/?name=Aarav+Sharma&background=FF9933&color=fff&size=150&bold=true", file: "avatar-aarav.png" },
  { url: "https://ui-avatars.com/api/?name=Priya+Patel&background=138808&color=fff&size=150&bold=true", file: "avatar-priya.png" },
  { url: "https://ui-avatars.com/api/?name=Rohan+Desai&background=FF9933&color=fff&size=150&bold=true", file: "avatar-rohan.png" },
  { url: "https://ui-avatars.com/api/?name=Ananya+Singh&background=138808&color=fff&size=150&bold=true", file: "avatar-ananya.png" },
];

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

async function downloadAll() {
  for (let i of [5, 11, 12, 13, 14, 15]) {
    imagesToDownload.push({
      url: `https://i.pravatar.cc/150?img=${i}`,
      file: `avatar-${i}.jpg`
    });
  }

  let successCount = 0;
  for (const img of imagesToDownload) {
    const destPath = path.join(imagesDir, img.file);
    try {
      console.log(`Downloading ${img.file}...`);
      await downloadFile(img.url, destPath);
      successCount++;
    } catch (err) {
      console.error(`Error downloading ${img.url}:`, err.message);
      if (img.url.includes("pravatar")) {
         console.log(`Fallback for ${img.file} to UI Avatars`);
         await downloadFile(`https://ui-avatars.com/api/?name=User+${img.file.split('-')[1].split('.')[0]}&background=random&color=fff&size=150&bold=true`, destPath).catch(console.error);
      }
    }
  }
  console.log(`Downloaded ${successCount} images successfully.`);
}

downloadAll();
