package org.restlet.build.js.test;

import java.io.File;

import org.junit.Test;
import org.restlet.build.js.ClassContextualizer;
import org.restlet.build.js.IOUtils;
import org.restlet.build.js.ClassContextualizer.ContextualizedContent;


public class ClassContextualizerTest {

	/*@Test
	public void test1() {
		ClassContextualizer contextualizer = new ClassContextualizer();
		//task.setSrcFile(new File("test/testcontext.js"));
		//task.setDestFile(new File("test/target-testcontext.js"));
		contextualizer.setRestletSrcPath(new File("../modules/org.restlet.js/src/js"));
		contextualizer.setContextualize(true);
		//contextualizer.setRequirePattern("var {modulename} = require(\"{modulename}\");");

		String fileToInclude = "test/testcontext.js";
		String contentToInclude = IOUtils.getFileContent(fileToInclude);
		ContextualizedContent cContent = contextualizer.handleFile(fileToInclude, contentToInclude);
		contentToInclude = cContent.getContent();
		System.out.println(contentToInclude);
	}*/

	/*@Test
	public void test2() {
		ClassContextualizer contextualizer = new ClassContextualizer();
		//task.setSrcFile(new File("test/testcontext.js"));
		//task.setDestFile(new File("test/target-testcontext.js"));
		contextualizer.setRestletSrcPath(new File("../modules/org.restlet.js/src/js"));
		contextualizer.setContextualize(true);
		//contextualizer.setRequirePattern("var {modulename} = require(\"{modulename}\");");

		String fileToInclude = "org/restlet/js/Request.js";
		String contentToInclude = IOUtils.getFileContent("test/testcontext.js");
		ContextualizedContent cContent = contextualizer.handleFile(fileToInclude, contentToInclude);
		contentToInclude = cContent.getContent();
		System.out.println(contentToInclude);
	}*/

	@Test
	public void test3() {
		ClassContextualizer contextualizer = new ClassContextualizer();
		//task.setSrcFile(new File("test/testcontext.js"));
		//task.setDestFile(new File("test/target-testcontext.js"));
		contextualizer.setRestletSrcPath(new File("../modules/org.restlet.js/src/js"));
		contextualizer.setContextualize(true);
		//contextualizer.setRequirePattern("var {modulename} = require(\"{modulename}\");");

		//String fileToInclude = "org/restlet/engine/adapter/ClientAdapter.js";
		//String fileToInclude = "org/restlet/Client.js";
		String fileToInclude = "org/restlet/engine/headers/HeaderUtils.js";
		String contentToInclude = IOUtils.getFileContent("../modules/org.restlet.js/src/js/"+fileToInclude);
		ContextualizedContent cContent = contextualizer.handleFile(fileToInclude, contentToInclude);
		contentToInclude = cContent.getContent();
		System.out.println(contentToInclude);
	}
}
