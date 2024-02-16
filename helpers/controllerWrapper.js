const controllerWrapper = (controller) => {
  const wrappedController = async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return wrappedController;
};

export default controllerWrapper;