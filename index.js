//FS MODULE
const fs = require("fs");
const slugify = require("slugify");

// const content = "Some content!";

// fs.writeFileSync("./txt/input.txt", content);

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// console.log(textIn);
// //asynchronous reading of file
// fs.readFile("./txt/start.txt", "utf-8", (e, data) => {
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (e, data1) => {
//     console.log(data1);
//   });
// });

// console.log("reading/writing file");

//HTTP Module

const http = require("http");
const url = require("url");

const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `./templates/template-overview.html`,
  "utf-8"
);

console.log(tempOverview.slice(0, 400));

const tempCard = fs.readFileSync(`./templates/template-card.html`, "utf-8");
const tempPorduct = fs.readFileSync(
  `./templates/template-product.html`,
  "utf-8"
);

const replace = (temp, product) => {
  let output = temp.replace(/{%ProductName%}/g, product.productName);
  output = output.replace(/{%Image%}/g, product.image);
  output = output.replace(/{%Quantity%}/g, product.quantity);
  output = output.replace(/{%Price%}/g, product.price);
  output = output.replace(/{%From%}/g, product.from);
  output = output.replace(/{%Nutrients%}/g, product.nutrients);
  output = output.replace(/{%Description%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const slugs = dataObj.map((e) => slugify(e.productName, { lower: true }));

console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //OVERVIEW PAGE

  if (pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj.map((e) => replace(tempCard, e)).join("");

    const output = tempOverview.replace("{%Product-Card%}", cardsHtml);

    res.end(output);
  }

  //PRODUCT PAGE
  else if (pathname === `/product`) {
    const { id } = query;

    const product = dataObj[id];

    const productHtml = replace(tempPorduct, product);

    res.end(productHtml);
  }

  //API PAGE
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }

  //ERROR PAGE
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "custom-header": "hello world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(5000, () => {
  console.log("Server listening at port 5000");
});
