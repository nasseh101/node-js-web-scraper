const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');
const writeStream = fs.createWriteStream('new-scrape.csv');

//Write Headers
writeStream.write(`category,date,rank,name,link,totalReviews,aggReviews,description \n`);

fs.createReadStream('old_scrape.csv')
    .pipe(csv())
    .on('data', (row) => {
        request(row.link, (error, response, html) => {
            if(!error && response.statusCode == 200){
                const $ = cheerio.load(html);

                const app_description_raw = $('.ui-expandable-content__inner');

                const app_description_text = app_description_raw.text();

                app_description_text.replace(/,/g, ' ');
                app_description_text.replace(/\r?\n|\r/g, ' ');

                //Write Row to CSV
                writeStream.write(`${row.category}, ${row.date}, ${row.rank}, ${row.name.replace(/,/g, ' ')}, ${row.link}, ${row.totalReviews}, ${row.aggReviews}, ${app_description_text.replace(/\s\s+/g, ' ')} \n`);

            }
        });



    })
    .on('end', ()=>{
        console.log('CSV file successfully processed!')
    });
