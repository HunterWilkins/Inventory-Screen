module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("landing");
    });

    app.get("/dashboard", function(req, res) {
        res.render("dashboard");
    });

    app.get("/faq", function(req, res) {
        res.render("faq");
    });
};