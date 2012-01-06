package org.restlet.js.tests.resource;

import org.restlet.Application;
import org.restlet.Request;
import org.restlet.Response;
import org.restlet.Uniform;
import org.restlet.data.MediaType;
import org.restlet.ext.jackson.JacksonRepresentation;
import org.restlet.js.tests.model.Contact;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;

public class ContactApplicationClientAsynchronousGet extends Application {
	public static void main(String[] args) {
		try {
			ClientResource clientResource = new ClientResource(
								"http://localhost:8182/contact/1");
			clientResource.setOnResponse(new Uniform() {
				public void handle(Request request, Response response) {
					Representation representation = response.getEntity();
					Contact contact = (new JacksonRepresentation<Contact>(
									representation, Contact.class)).getObject();
					System.out.println(contact.getId()
							+" - "+contact.getLastName()+" "+contact.getFirstName());
				}
			});
			clientResource.get(MediaType.APPLICATION_JSON);
			Thread.sleep(1000);
		} catch(Exception ex) { ex.printStackTrace(); }
	}
}
