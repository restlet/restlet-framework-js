package org.restlet.build.js.test;

import java.io.File;

import org.junit.Test;
import org.restlet.build.js.ClassContextualizer;
import org.restlet.build.js.IOUtils;


public class ClassContextualizerTest {

	@Test
	public void test() {
		ClassContextualizer contextualizer = new ClassContextualizer();
		/*task.setSrcFile(new File("test/testcontext.js"));
		task.setDestFile(new File("test/target-testcontext.js"));*/
		contextualizer.setRestletSrcPath(new File("../modules/org.restlet.js/src/js"));
		contextualizer.setContextualize(true);
		
		String fileToInclude = "test/testcontext.js";
		String contentToInclude = IOUtils.getFileContent(fileToInclude);
		contentToInclude = contextualizer.handleFile(fileToInclude, contentToInclude);
		System.out.println(contentToInclude);
	}
}
