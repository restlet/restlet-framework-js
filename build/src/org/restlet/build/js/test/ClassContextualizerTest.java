package org.restlet.build.js.test;

import java.io.File;

import org.junit.Test;
import org.restlet.build.js.ClassContextualizer;
import org.restlet.build.js.IOUtils;
import org.restlet.build.js.ClassContextualizer.ContextualizedContent;


public class ClassContextualizerTest {

	@Test
	public void test() {
		ClassContextualizer contextualizer = new ClassContextualizer();
		/*task.setSrcFile(new File("test/testcontext.js"));
		task.setDestFile(new File("test/target-testcontext.js"));*/
		contextualizer.setRestletSrcPath(new File("../modules/org.restlet.js/src/js"));
		contextualizer.setContextualize(true);
		//contextualizer.setRequirePattern("var {modulename} = require(\"{modulename}\");");

		String fileToInclude = "test/testcontext.js";
		String contentToInclude = IOUtils.getFileContent(fileToInclude);
		ContextualizedContent cContent = contextualizer.handleFile(fileToInclude, contentToInclude);
		contentToInclude = cContent.getContent();
		System.out.println(contentToInclude);
	}
}
