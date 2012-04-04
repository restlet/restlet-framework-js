package org.restlet.build.js;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.types.FileSet;

public class ReplaceIncludeTask extends Task {
	private File restletSrcPath;
	private File srcFile;
	private File destFile;
	private String baseDir;
	private boolean contextualize = true;
	private List<FileSet> filesets = new ArrayList<FileSet>();
	private ClassContextualizer contextualizer;

	public ReplaceIncludeTask() {
		this.contextualizer = new ClassContextualizer();		
	}
	
	public FileSet createFileSet() {
		FileSet fileSet = new FileSet();
		filesets.add(fileSet);
		return fileSet;
	}
	
	private boolean hasSingleBaseDirectory() {
		return (baseDir!=null && filesets==null);
	}
	
	public void execute() throws BuildException {
		if (srcFile==null || !srcFile.exists()) {
			throw new IllegalArgumentException(
					"Source file isn't specified or doesn't exist");
		}
		
		if (hasSingleBaseDirectory()) {
			doExecuteForSingleBaseDirectory();
		} else {
			doExecuteForMultipleBaseDirectory();
		}
	}
	
	private void doExecuteForSingleBaseDirectory() {
		String content = IOUtils.getFileContent(srcFile);
		StringBuilder newContent = new StringBuilder();
		StringTokenizer st = new StringTokenizer(content, "\n", true);
		while (st.hasMoreTokens()) {
			String line = st.nextToken();
			
			if (line.trim().startsWith("#include ")) {
				String fileToInclude = line.trim().replace("#include ", "").replace("#", "");
				String contentToInclude = IOUtils.getFileContent(baseDir+File.separator+fileToInclude);
				contentToInclude = contextualizer.handleFile(fileToInclude, contentToInclude);
				if (contentToInclude!=null) {
					newContent.append(contentToInclude);
				} else {
					System.err.println("Unable to retrieve content for include "+fileToInclude);
				}
			} else {
				newContent.append(line);
			}
		}

		IOUtils.setFileContent(destFile, newContent.toString());
	}
	
	private String getFileContentFromFilesets(String fileToInclude) {
		for (FileSet fileset : filesets) {
			File fromDir = fileset.getDir(getProject());
			if (fromDir.exists()) {
				File file = new File(fromDir.getAbsoluteFile()+File.separator+fileToInclude);
				if (file.exists()) {
					return IOUtils.getFileContent(file);
				}
			}
		}
		return null;
	}

	private void doExecuteForMultipleBaseDirectory() {
		String content = IOUtils.getFileContent(srcFile);
		StringBuilder newContent = new StringBuilder();
		StringTokenizer st = new StringTokenizer(content, "\n", true);
		while (st.hasMoreTokens()) {
			String line = st.nextToken();
			
			if (line.trim().startsWith("#include ")) {
				String fileToInclude = line.trim().replace("#include ", "").replace("#", "");
				String contentToInclude = getFileContentFromFilesets(fileToInclude);
				contentToInclude = contextualizer.handleFile(fileToInclude, contentToInclude);
				if (contentToInclude!=null) {
					newContent.append(contentToInclude);
				} else {
					System.err.println("Unable to retrieve content for include "+fileToInclude);
				}
			} else {
				newContent.append(line);
			}
		}

		IOUtils.setFileContent(destFile, newContent.toString());
	}

	public File getSrcFile() {
		return srcFile;
	}

	public void setSrcFile(File srcFile) {
		this.srcFile = srcFile;
	}

	public File getDestFile() {
		return destFile;
	}

	public void setDestFile(File destFile) {
		this.destFile = destFile;
	}

	public String getBaseDir() {
		return baseDir;
	}

	public void setBaseDir(String baseDir) {
		this.baseDir = baseDir;
	}

	public List<FileSet> getFilesets() {
		return filesets;
	}

	public void setFilesets(List<FileSet> filesets) {
		this.filesets = filesets;
	}

	public File getRestletSrcPath() {
		return restletSrcPath;
	}

	public void setRestletSrcPath(File restletSrcPath) {
		this.restletSrcPath = restletSrcPath;
		if (this.contextualizer!=null) {
			this.contextualizer.setRestletSrcPath(restletSrcPath);
		}
	}

	public boolean isContextualize() {
		return contextualize;
	}

	public void setContextualize(boolean contextualize) {
		this.contextualize = contextualize;
		if (this.contextualizer!=null) {
			this.contextualizer.setContextualize(contextualize);
		}
	}

}
