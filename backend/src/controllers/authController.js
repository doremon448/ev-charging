// Minimal working register controller for testing route wiring

exports.register = async (req, res) => {
  res.json({ message: "Register endpoint works (test)" }); // Test response
};