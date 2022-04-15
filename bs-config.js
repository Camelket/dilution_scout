module.exports = {
    proxy: "localhost:8000",
    files: ["public/stylesheets/*.css", "views/*.pug", "**/*.js"],
    ignore: ["node_modules"],
    reloadDelay: 6,
    ui: false,
    notify: false,
    port: 3000,
  };