const { Brand } = require("../models");

module.exports = {
  index(req, res) {
    return Brand.findAll()
      .then(brands => {
        res.status(200).json(brands);
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error });
      });
  },

  create(req, res) {
    const data = req.body;

    return Brand.create(data)
      .then(brand => {
        res.status(200).json({
          status: 200,
          message: "Client created",
          data: { brand: brand.id }
        });
      })
      .catch(error => {
        console.error("Error on creating client", error);
        res.status(500).json({ message: "Error on creating brand" });
      });
  },

  update(req, res) {
    const data = req.body;
    const brandId = req.params.brandId;

    return Brand.update(data, { where: { id: brandId } })
      .then(result => {
        res.status(200).json({ status: 200, message: "Brand updated" });
      })
      .catch(error => {
        console.error("Error on updating Brand", error);
        res
          .status(500)
          .json({ status: 500, message: "Error on updating Brand" });
      });
  },

  delete(req, res) {
    const brandId = req.params.brandId;

    return Brand.destroy({ where: { id: brandId } })
      .then(affectedRows => {
        if (affectedRows === 0) {
          return res
            .status(404)
            .json({ status: 404, message: "Brand not found" });
        } else if (affectedRows === 1) {
          return res
            .status(200)
            .json({ status: 200, message: "Brand deleted" });
        } else {
          return Promise.reject(
            new Error("Unexpected error. Wront ammount deletion of Brand")
          );
        }
      })
      .catch(error => {
        console.error("Error on deleting Brand", error);
        res
          .status(500)
          .json({ status: 500, message: "Error on deleting Brand" });
      });
  }
};
