exports.getInventory = async (req, res) => {
    try {
      // Aquí usas req.user.id para encontrar el inventario del usuario
      const inventory = await InventoryModel.find({ userId: req.user.id });
      res.json(inventory);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Error del servidor." });
    }
  };

