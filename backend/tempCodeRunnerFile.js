app.use((req, res, next) => {
    if (req.protocol === "http") {
        res.redirect(`https://${req.hostname}${req.url}`);
    } else {
        next();
    }
});