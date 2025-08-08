const { getBusLaneByNumber } = require('../services/odsayService');

exports.getBusLane = async (req, res) => {
  const {lang, busNo, cityCode} = req.query;

  if (!busNo){
    return res.status(400).json({error: 'busNo가 없습니다.'})
  }

  try {
    const busLane = await getBusLaneByNumber(parseInt(lang), busNo, parseInt(cityCode));
    res.json(busLane);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}