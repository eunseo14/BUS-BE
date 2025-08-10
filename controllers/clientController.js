const { getBusLaneByNumber } = require("../services/odsayService");

exports.getBusLane = async (req, res) => {
  const { lang, busNo, cityCode } = req.query;

  if (!busNo) {
    return res.status(200).json({
        status: 400,
        body: {
          success: false,
          message: '버스 번호를 입력해주세요!',
        },
      });
  }

  try {
    const result = await getBusLaneByNumber(
      parseInt(lang),
      busNo,
      parseInt(cityCode)
    );
    if (result?.status === 400) {
      return res.status(200).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
