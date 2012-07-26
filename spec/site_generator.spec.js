var site_generator = require("../lib/site_generator.js");
var module_utils = require("../lib/utils/module_utils.js");

describe("setup", function(){
	var sample_config = {
		plugins: {
			template_handler: "sample_template_handler",
			content_handler: "sample_content_handler",
			template_engine: "sample_template_engine",
			compilers: {
				".js": "sample_js_compiler",	
				".css": "sample_css_compiler"	
			}
		}
	}

	it("setup the templates handler", function(){
		spyOn(module_utils, "requireAndSetup").andCallFake(function(id, config){
			return {"id": id};	
		});

		site_generator.setup(sample_config);
		expect(site_generator.templates.id).toEqual("sample_template_handler");
	});

	it("setup the contents handler", function(){
		spyOn(module_utils, "requireAndSetup").andCallFake(function(id, config){
			return {"id": id};	
		});

		site_generator.setup(sample_config);
		expect(site_generator.contents.id).toEqual("sample_content_handler");
	});

	it("setup the template engine", function(){
		spyOn(module_utils, "requireAndSetup").andCallFake(function(id, config){
			return {"id": id};	
		});

		site_generator.setup(sample_config);
		expect(site_generator.templateEngine.id).toEqual("sample_template_engine");
	});

});

describe("collect sections", function(){
	it("collect the sections from the templates", function(){
		var spyTemplates = jasmine.createSpy();
		site_generator.templates = {"getSections": spyTemplates};

		var spyCallback = jasmine.createSpy();
		site_generator.collectSections(spyCallback);

		expect(spyTemplates).toHaveBeenCalled();
	});

	it("collect the sections from the contents", function(){
		var spyTemplates = jasmine.createSpy();
		spyTemplates.andCallFake(function(path, callback){
			return callback([]);	
		});
		site_generator.templates = {"getSections": spyTemplates};

		var spyContents = jasmine.createSpy();
		site_generator.contents = {"getSections": spyContents};

		var spyCallback = jasmine.createSpy();
		site_generator.collectSections(spyCallback);

		expect(spyContents).toHaveBeenCalled();
	});

	it("call the callback with the union of both template and content sections", function(){
		var spyTemplates = jasmine.createSpy();
		spyTemplates.andCallFake(function(path, callback){
			return callback(["about", "assets", "contact"]);	
		});
		site_generator.templates = {"getSections": spyTemplates};

		var spyContents = jasmine.createSpy();
		spyContents.andCallFake(function(path, callback){
			return callback(["about", "contact", "blog", "other"]);	
		});
		site_generator.contents = {"getSections": spyContents};

		var spyCallback = jasmine.createSpy();
		site_generator.collectSections(spyCallback);

		expect(spyCallback).toHaveBeenCalledWith(null, ["about", "assets", "contact", "blog", "other"]);
	});

});

describe("get static and compilable templates", function(){

	it("get the templates for the given section", function(){
		var spyGetTemplates = jasmine.createSpy();
		site_generator.templates = {"getTemplates": spyGetTemplates};

		var spyCallback = jasmine.createSpy();
		site_generator.getStaticAndCompilableTemplates("path/test", spyCallback);

		expect(spyGetTemplates).toHaveBeenCalled();
	});

	it("filter only the static and compilable templates", function(){
		var spyGetTemplates = jasmine.createSpy();
		spyGetTemplates.andCallFake(function(path, calback){
			return callback([null, {"full_path": "path/sub_dir/test.html", "last_modified": new Date(2012, 6, 16)},
												  	 {"full_path": "path/sub_dir/test.mustache", "last_modified": new Date(2012, 6, 16)}
												  	 {"full_path": "path/sub_dir/_layout.mustache", "last_modified": new Date(2012, 6, 16)}
												  	 {"full_path": "path/sub_dir/_header.mustache", "last_modified": new Date(2012, 6, 16)}
												  	 {"full_path": "path/sub_dir/image.png", "last_modified": new Date(2012, 6, 16)}
											]);	
		});
		site_generator.templates = {"getTemplates": spyGetTemplates};

		var spyCallback = jasmine.createSpy();
		site_generator.getStaticAndCompilableTemplates("path/sub_dir", spyCallback);

		expect(getStaticAndCompilableTemplates).toHaveBeenCalledWith(null, ["path/sub_dir/test.html", "path/sub_dir/image.png"]);
	});
});


