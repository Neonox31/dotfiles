// vi: sts=2 sw=2 et
const Gio = imports.gi.Gio;
const GdkPixbuf = imports.gi.GdkPixbuf;

const ExtensionUtils = imports.misc.extensionUtils;
const Local = ExtensionUtils.getCurrentExtension();
const Filename = Local.imports.filename.exports;
const {dump} = Local.imports.dump.exports;

// width and height of thumbnail
const size = 64;
const emptyImagePath = Local.path + "/empty64.png";

const getIcon = (path) => {
  // creates an scaled with aspect ratio where the larger side is 64px
  let source = GdkPixbuf.Pixbuf.new_from_file_at_size(path, size, size);

  // load transparent 64x64 image
  let dst = GdkPixbuf.Pixbuf.new_from_file_at_size(
    emptyImagePath, size, size
  );

  let {width, height} = source;
  let offsetX = (size - width)/2;
  let offsetY = (size - height)/2;

  // put smaller image on top of bigger image
  source.composite(
    dst,
    offsetX, offsetY,
    width, height,
    offsetX, offsetY,
    1, 1,      // scaleX, scaleY
    GdkPixbuf.InterpType.HYPER,
    255        // overall_alpha
  );

  // return as file icon
  let scaledPath = Filename.getTemp();
  dst.savev(scaledPath, "png", [], []);
  let scaledFile = Gio.File.new_for_path(scaledPath);
  return new Gio.FileIcon({ file: scaledFile });
}

var exports = {
  getIcon
};
