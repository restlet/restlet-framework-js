package org.restlet.build.js.test;

import org.junit.Test;

public class StringReplaceTest {

	@Test
	public void replace() {
		StringBuilder newContent = new StringBuilder();
		newContent.append("console.log(\"----- CORE\");\n");
		newContent.append("\n");
		newContent.append("var commons = require(\"./commons.js\");\n");
		newContent.append("var http = require(\"http\");\n");
		newContent.append("var iconv = require(\"iconv-lite\");\n");
		newContent.append("\n");
		newContent.append("module.exports = {};\n");
		newContent.append("\n");
		newContent.append("console.log(\"####\");\n");
		newContent.append("#include org/restlet/Level.js#\n");
		newContent.append("module.exports[\"Level\"] = Level;\n");
		newContent.append("console.log(\"####\");\n");
		newContent.append("\n");
		newContent.append("#require-include resource#\n");
		newContent.append("\n");
		newContent.append("//Root entities\n");
		newContent.append("\n");
		newContent.append("#include org/restlet/Restlet.js#\n");
		newContent.append("\n");
		newContent.append("#include org/restlet/Context.js#\n");
		newContent.append("\n");
		newContent.append("#include org/restlet/Logger.js#\n");
		
		String newContentString = newContent.toString();
		
		String moduleName = "resource";
		String requirePattern = "var {modulename} = require(\"./restlet-{modulename}.js\");";

		System.out.println("- before = "+(newContentString.indexOf("#require-include "+moduleName+"#")));
		System.out.println("-> #require-include "+moduleName+"#");
		System.out.println("-> "+requirePattern.replaceAll("\\{modulename\\}", moduleName));
		int startIndex = newContentString.indexOf("#require-include "+moduleName+"#");
		int endIndex = startIndex + ("#require-include "+moduleName+"#").length();
		newContent.replace(startIndex, endIndex, requirePattern.replaceAll("\\{modulename\\}", moduleName));
		//newContentString.replaceAll("#require-include "+moduleName+"#", requirePattern.replaceAll("\\{modulename\\}", moduleName));
		System.out.println("- after = "+(newContentString.indexOf("#require-include "+moduleName+"#")));
		System.out.println("newContentString = "+newContent.toString());
	}
}
