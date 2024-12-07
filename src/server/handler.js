const predictClassification = require("../services/inferenceService");
const { storeData, getAllData } = require("../services/storeData");
const crypto = require("crypto");
const InputError = require('../exceptions/InputError');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result: label,
      suggestion,
      createdAt,
    };

    await storeData(id, data);

    const response = h.response({
      status: "success",
      message: "Model is predicted successfully",
      data,
    });
    response.code(201);
    return response;
  } catch (error) {
    if (error instanceof InputError) {
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(error.statusCode);
    }
  }
}

async function getPredictHistoryHandler(request, h) {
  const history = await getAllData();

  if (history.length === 0) {
    return h
      .response({
        status: "fail",
        message: "No prediction history found",
      })
      .code(404);
  }

  return h
    .response({
      status: "success",
      message: "Prediction history fetched successfully",
      data: history,
    })
    .code(200);
}

module.exports = { postPredictHandler, getPredictHistoryHandler };
