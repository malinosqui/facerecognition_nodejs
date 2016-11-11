/*jslint node: true, nomen: true*/
"use strict";

const path = require('path');
const _ = require('underscore');
const Faced = require('faced');
const faced = new Faced();
const app = require('express')();
const bodyParser = require('body-parser');
const fs = require('fs');


const colors = {
    "face": [0, 0, 0],
    "mouth": [255, 0, 0],
    "nose": [255, 255, 255],
    "eyeLeft": [0, 0, 255],
    "eyeRight": [0, 255, 0]
};


app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '150mb' }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/controllers/index.js', (req, res) => {
    res.sendFile(__dirname + '/controllers/index.js');
});

app.get('/rec/image.png', (req, res) => {
    res.sendFile(__dirname + '/images/face.features.png');
});


app.post('/rec', (req, res) => {

    let src = req.body.image.replace('data:image/png;base64,', '');

    fs.writeFile("images/face.png", src, 'base64', function (err) {
        if (err)
            return;

        faced.detect(path.resolve('images/face.png'), function (faces, image, file) {
            let output;

            if (!faces) {
                console.error("Could not open %s", file);
                return;
            }

            function draw(feature, color) {
                image.rectangle(
                    [feature.getX(), feature.getY()],
                    [feature.getWidth(), feature.getHeight()],
                    color,
                    2
                );
            }

            _.each(faces, function (face) {
                draw(face, colors.face);

                _.each(face.getFeatures(), function (features, name) {
                    _.each(features, function (feature) {
                        draw(feature, colors[name]);
                    });
                });
            });

            output = file.split('.');
            output.push('features', output.pop());
            output = output.join('.');

            console.log('Processed %s', output);
            image.save(output);

            res.send('success');

        });
    });
});

app.listen(3000);

// _.each(process.argv.slice(2), function (file) {
//     faced.detect(path.resolve(file), worker);
// });