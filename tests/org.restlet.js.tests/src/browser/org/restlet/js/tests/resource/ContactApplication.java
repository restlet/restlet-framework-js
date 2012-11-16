package org.restlet.js.tests.resource;

import java.io.File;
import java.util.logging.Level;

import org.restlet.Application;
import org.restlet.Component;
import org.restlet.Restlet;
import org.restlet.data.Protocol;
import org.restlet.engine.Engine;
import org.restlet.resource.Directory;
import org.restlet.routing.Router;

public class ContactApplication extends Application {
	public Restlet createInboundRoot() {
		Router router = new Router(getContext());
		//resource
   		router.attach("/contact/{id}",
   						SimpleContactServerResource.class);
   		//directory
   		router.attach("/static/", new Directory(getContext(),
				"file://"+(new File(".")).getAbsolutePath()+"/src/browser/static/"));
   		return router;
	}

	public static void main(String[] args) {
		try {
			Engine.getInstance().setLogLevel(Level.FINE);
			Component component = new Component();
			component.getServers().add(Protocol.HTTP, 8182);
			component.getClients().add(Protocol.FILE);
			component.getDefaultHost().attach(new ContactApplication());
	        component.start();
	        Thread.sleep(6000);
		} catch(Exception ex) {}
	}
}
