
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GdkPixbuf = imports.gi.GdkPixbuf;
const Lang = imports.lang;

const Mainloop = imports.mainloop;

const Gettext = imports.gettext.domain('emoji-selector');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

//-----------------------------------------------

function init() {
	Convenience.initTranslations();
}

//-----------------------------------------------

const PrefsPage = new Lang.Class({
	Name: "PrefsPage",
	Extends: Gtk.ScrolledWindow,

	_init: function () {
		this.parent({
			vexpand: true,
			can_focus: true
		});
		
		this.stackpageMainBox = new Gtk.Box({
			visible: true,
			can_focus: false,
			margin_left: 50,
			margin_right: 50,
			margin_top: 20,
			margin_bottom: 20,
			orientation: Gtk.Orientation.VERTICAL,
			spacing: 18
		});
		this.add(this.stackpageMainBox);
	},
	
	add_section: function(titre) {
		let section = new Gtk.Box({
			orientation: Gtk.Orientation.VERTICAL,
			spacing: 6,
		});
		if (titre != "") {
			section.add(new Gtk.Label({
				label: '<b>' + titre + '</b>',
				halign: Gtk.Align.START,
				use_markup: true,
			}));
		}
	
		let a = new Gtk.ListBox({
			can_focus: true,
			selection_mode: Gtk.SelectionMode.NONE,
		});
		section.add(a);
		this.stackpageMainBox.add(section);
		return a;
	},

	add_row: function(filledbox, section) {
		let a = new Gtk.ListBoxRow({
			can_focus: true,
			selectable: false,	
		});
		a.add(filledbox);
		section.add(a);
		return a;
	},
	
	add_widget: function(filledbox) {
		this.stackpageMainBox.add(filledbox);
	},
});

//--------------------

const EmojiPrefsWidget = new Lang.Class({
	Name: "EmojiPrefsWidget",
	Extends: Gtk.Stack,
	
	_init: function () {
		this.parent({transition_type: Gtk.StackTransitionType.SLIDE_LEFT_RIGHT});
		
		this.switcher = new Gtk.StackSwitcher({
			halign: Gtk.Align.CENTER,
			stack: this
		});
		this.switcher.show_all();
	},
	
	add_page: function (id, title) {
		let page = new PrefsPage();
		this.add_titled(page, id, title);
		return page;
	}
});

let SETTINGS = Convenience.getSettings();

function buildPrefsWidget() {
	let widget = new EmojiPrefsWidget();
	
	let settingsPage = widget.add_page("settings", _("Settings"));	
	
	let layoutSection = settingsPage.add_section(_("Layout"));
	let appearanceSection = settingsPage.add_section(_("Appearance"));
	let keybindingSection = settingsPage.add_section(_("Keybinding"));
	
	let RELOAD_TEXT = _("Modifications will be effective after reloading the extension.");
	
		//-------------------------------------------------
		
		let emojiSizeLabel = _("Size of emojis (px):");
		
		let emojiSize = new Gtk.SpinButton();
		emojiSize.set_sensitive(true);
		emojiSize.set_range(10, 100);
		emojiSize.set_value(32);
		emojiSize.set_value(SETTINGS.get_int('emojisize'));
		emojiSize.set_increments(1, 2);
		
		emojiSize.connect('value-changed', Lang.bind(this, function(w){
			var value = w.get_value_as_int();
			SETTINGS.set_int('emojisize', value);
		}));
		
		let sizeBox = new Gtk.Box({
			orientation: Gtk.Orientation.HORIZONTAL,
			spacing: 15,
			margin: 6,
		});
		sizeBox.pack_start(new Gtk.Label({ label: emojiSizeLabel, halign: Gtk.Align.START }), false, false, 0);
		sizeBox.pack_end(emojiSize, false, false, 0);
		
		//------------------------------------------------
		
		let lightThemeLabel = _("Use darker font:");
		let lightThemeSwitch = new Gtk.Switch();
		lightThemeSwitch.set_state(false);
		lightThemeSwitch.set_state(SETTINGS.get_boolean('light-theme'));
		
		lightThemeSwitch.connect('notify::active', Lang.bind(this, function(widget) {
			if (widget.active) {
				SETTINGS.set_boolean('light-theme', true);
			} else {
				SETTINGS.set_boolean('light-theme', false);
			}
		}));
		
		let lightThemeBox = new Gtk.Box({
			orientation: Gtk.Orientation.HORIZONTAL,
			spacing: 15,
			margin: 6,
			tooltip_text: _("This is useful if your system doesn't support color emojis and your GNOME Shell theme has a white menu background."),
		});
		lightThemeBox.pack_start(new Gtk.Label({ label: lightThemeLabel, halign: Gtk.Align.START }), false, false, 0);
		lightThemeBox.pack_end(lightThemeSwitch, false, false, 0);
		
		//------------------------------------------------
		
		let positionLabel = _("General layout:");
		
		let positionCombobox = new Gtk.ComboBoxText({
			visible: true,
			can_focus: false,
			halign: Gtk.Align.END,
			valign: Gtk.Align.CENTER
		});
		
		positionCombobox.append('top', _("From top to bottom"));
		positionCombobox.append('bottom', _("From bottom to top"));
		
		positionCombobox.active_id = SETTINGS.get_string('position');
		
		positionCombobox.connect("changed", (widget) => {
			SETTINGS.set_string('position', widget.get_active_id());
		});
		
		let positionBox = new Gtk.Box({
			orientation: Gtk.Orientation.HORIZONTAL,
			spacing: 15,
			margin: 6,
			tooltip_text: _("Displaying the interface from the bottom is nice if you use a bottom panel instead of the default top bar.")+'\n'+ RELOAD_TEXT,
		});
		positionBox.pack_start(new Gtk.Label({ label: positionLabel, halign: Gtk.Align.START }), false, false, 0);
		positionBox.pack_end(positionCombobox, false, false, 0);

		//-------------------------------------
		
		let nbColsLabel = _("Number of emojis per line:");
		
		let nbCols = new Gtk.SpinButton();
		nbCols.set_sensitive(true);
		nbCols.set_range(1, 60);
		nbCols.set_value(11);
		nbCols.set_value(SETTINGS.get_int('nbcols'));
		nbCols.set_increments(1, 2);
		
		nbCols.connect('value-changed', Lang.bind(this, function(w){
			var value = w.get_value_as_int();
			SETTINGS.set_int('nbcols', value);
		}));
		
		let colsBox =  new Gtk.Box({
			orientation: Gtk.Orientation.HORIZONTAL,
			spacing: 15,
			margin: 6,
		});
		colsBox.pack_start(new Gtk.Label({ label: nbColsLabel, halign: Gtk.Align.START }), false, false, 0);
		colsBox.pack_end(nbCols, false, false, 0);
	
		//---------------------------------------------------
		
		let keybindingBox = new Gtk.Box({
			orientation: Gtk.Orientation.VERTICAL,
			spacing: 5,
			tooltip_text: _("Default value is") +  " <Super>e" +'\n'+ RELOAD_TEXT
		});
		
		let keybindingEntry = new Gtk.Entry({
			sensitive: SETTINGS.get_boolean('use-keybinding'),
			hexpand: true
		});
		
		if (SETTINGS.get_strv('emoji-keybinding') != '') {
			keybindingEntry.text = SETTINGS.get_strv('emoji-keybinding')[0];
		}
		
		let keybindingButton = new Gtk.Button({ sensitive: SETTINGS.get_boolean('use-keybinding'), label: _("Apply") });
		
		keybindingButton.connect('clicked', Lang.bind(this, function(widget) {
			SETTINGS.set_strv('emoji-keybinding', [keybindingEntry.text]);
		}));
		let keybindingBox1 =  new Gtk.Box({
			orientation: Gtk.Orientation.HORIZONTAL,
			spacing: 15,
			margin: 6,
		});
		
		//---------------------------------------------------------------
		
		let keybindingLabel = _("Use a keyboard shortcut to toggle the menu:");
		
		let keybindingSwitch = new Gtk.Switch();
		keybindingSwitch.set_state(true);
		keybindingSwitch.set_state(SETTINGS.get_boolean('use-keybinding'));
		
		keybindingSwitch.connect('notify::active', Lang.bind(this, function(widget) {
			if (widget.active) {
				SETTINGS.set_boolean('use-keybinding', true);
				keybindingEntry.sensitive = true;
				keybindingButton.sensitive = true;
				alwaysShowSwitch.sensitive = true;
			} else {
				SETTINGS.set_boolean('use-keybinding', false);
				keybindingEntry.sensitive = false;
				keybindingButton.sensitive = false;
				SETTINGS.set_boolean('always-show', true);
				alwaysShowSwitch.set_state(true);
				alwaysShowSwitch.sensitive = false;
			}
		}));
		
		let keybindingBox2 =  new Gtk.Box({
			orientation: Gtk.Orientation.HORIZONTAL,
			spacing: 15,
			margin: 6,
		});
		keybindingBox2.pack_start(new Gtk.Label({ label: keybindingLabel, halign: Gtk.Align.START }), false, false, 0);
		keybindingBox2.pack_end(keybindingSwitch, false, false, 0);
		
		keybindingBox.pack_start(keybindingBox2, false, false, 0);
		keybindingBox1.pack_start(keybindingEntry, true, true, 0);
		keybindingBox1.pack_end(keybindingButton, false, false, 0);
		keybindingBox.pack_end(keybindingBox1, false, false, 0);
		
		//-------------------------------------------------------
		
		let alwaysShowLabel = _("Always show the icon:");
		let alwaysShowSwitch = new Gtk.Switch();
		alwaysShowSwitch.set_state(true);
		alwaysShowSwitch.set_state(SETTINGS.get_boolean('always-show'));
		
		alwaysShowSwitch.connect('notify::active', Lang.bind(this, function(widget) {
			if (widget.active) {
				SETTINGS.set_boolean('always-show', true);
			} else {
				SETTINGS.set_boolean('always-show', false);
			}
		}));
		
		let alwaysShowBox = new Gtk.Box({
			orientation: Gtk.Orientation.HORIZONTAL,
			spacing: 15,
			margin: 6,
//			tooltip_text: _(""),
		});
		alwaysShowBox.pack_start(new Gtk.Label({ label: alwaysShowLabel, halign: Gtk.Align.START }), false, false, 0);
		alwaysShowBox.pack_end(alwaysShowSwitch, false, false, 0);
		
		//-------------------------------------------------------
	
	settingsPage.add_row(colsBox, layoutSection);
	settingsPage.add_row(positionBox, layoutSection);
	settingsPage.add_row(lightThemeBox, appearanceSection);
	settingsPage.add_row(sizeBox, appearanceSection);
	settingsPage.add_row(keybindingBox, keybindingSection);	
	settingsPage.add_row(alwaysShowBox, keybindingSection);	
	
	//------------------------------------

	let aboutPage = widget.add_page("about", _("About"));
		
		let a_name = '<b>' + Me.metadata.name.toString() + '</b>';
		let a_uuid = Me.metadata.uuid.toString();
		let a_description = _(Me.metadata.description.toString());
		
		let label_name = new Gtk.Label({ label: a_name, use_markup: true, halign: Gtk.Align.CENTER });
		
		let a_image = new Gtk.Image({ pixbuf: GdkPixbuf.Pixbuf.new_from_file_at_size(Me.path+'/icons/about_icon.png', 128, 128) });
		let label_description = new Gtk.Label({ label: a_description, wrap: true, halign: Gtk.Align.CENTER });
		
		let label_contributors = new Gtk.Label({
			label: "Author: roschan. Contributors: amivaleo, picsi, jonnius",
			wrap: true,
			halign: Gtk.Align.CENTER
		});
		
		let about_box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 10});
		about_box.pack_start(label_name, false, false, 0);
		about_box.pack_start(a_image, false, false, 0);
		about_box.pack_start(label_description, false, false, 0);
		about_box.pack_start(label_contributors, false, false, 0);
		
		let LinkBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
		let a_version = ' (v' + Me.metadata.version.toString() + ') ';
		
		let url_button = new Gtk.LinkButton({
			label: _("Report bugs or ideas"),
			uri: Me.metadata.url.toString()
		});
		
		LinkBox.pack_start(url_button, false, false, 0);
		LinkBox.pack_end(new Gtk.Label({ label: a_version, halign: Gtk.Align.START }), false, false, 0);
		
		aboutPage.stackpageMainBox.pack_end(LinkBox, false, false, 0);
	
	aboutPage.add_widget(about_box);

	//----------------------------------------------------

	Mainloop.timeout_add(0, () => {
		let headerBar = widget.get_toplevel().get_titlebar();
		headerBar.custom_title = widget.switcher;
		return false;
	});

	widget.show_all();
	
	return widget;
}


