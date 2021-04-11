const express = require('express');

const app = express();

app.use(express.static('./dist/frntrpl'));

app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: 'dist/frntrpl/'}
  );
})

app.listen(process.env.PORT || 80);
