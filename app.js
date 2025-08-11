const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

// 라우터 파일들 불러오기
const clientRoutes = require('./routes/clientRoutes');
// const deviceRoutes = require('./routes/deviceRoutes');

app.use(express.json());
app.use(cors());

app.use('/', clientRoutes);
// app.use('/', deviceRoutes);

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});