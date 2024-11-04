const ManufacterModel = require("../model/manufacter.model");

exports.getManufacterName = async function (req, res) {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const searchTerm = req.query.search || "";
  const all = req.query.all === "true";
  try {
    const { total, manufacters } = await ManufacterModel.getManufacterName(
      limit,
      (page - 1) * limit,
      searchTerm,
      all
    );

    res.json({ total, manufacters });
  } catch (error) {
    console.error("Error get manufacter :", error);
    res.status(500).json({ message: "Error get manufacter" });
  }
};

exports.getAllManufacter = async function (req, res) {
  try {
    const response = await ManufacterModel.getAllManufacter();
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error get manufacter :", error);
    res.status(500).json({ message: "Error get manufacter" });
  }
};

exports.getManufacterNameById = async function (req, res) {
  const { id } = req.params;
  try {
    ManufacterModel.getManufacterNameById(id)
      .then((response) => {
        res.json(response);
      })
      .catch((error) => {
        console.error("Error get manufacter :", error);
        res.status(500).json({ message: "Error get manufacter" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Interna Server Error" });
  }
};

exports.createManufacterName = async function (req, res) {
  try {
    const { category_id, name } = req.body;
    ManufacterModel.createManufacterName(category_id, name)
      .then(() => {
        res.json({
          success: true,
          message: "Manufacter created successfull",
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Error create Manufacter" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Interna Server Error" });
  }
};

exports.deleteManufacterName = async function (req, res) {
  const { id } = req.params;
  try {
    ManufacterModel.deleteManufacterName(id)
      .then(() => {
        res.json({
          success: true,
          message: "Manfucter deleted successfull",
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Error deleting Manfucter" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Interna Server Error" });
  }
};

exports.getManufacterByCatId = async function (req, res) {
  const { id } = req.params;
  try {
    ManufacterModel.getManufacterByCatId(id)
      .then((response) => {
        res.json(response);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Error geting Manfucter" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Interna Server Error" });
  }
};

exports.getManufacterBySubCatId = async function (req, res) {
  const { id, catId } = req.params;
  try {
    ManufacterModel.getManufacterBySubCatId(id, catId)
      .then((response) => {
        res.json(response);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Error geting Manfucter" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Interna Server Error" });
  }
};

exports.getMaunufacterByItemCategory = async function (req, res) {
  const { id, slug } = req.params;
  try {
    ManufacterModel.getMaunufacterByItemCategory(id, slug)
      .then((response) => {
        res.json(response);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Error geting Manfucter" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Interna Server Error" });
  }
};
