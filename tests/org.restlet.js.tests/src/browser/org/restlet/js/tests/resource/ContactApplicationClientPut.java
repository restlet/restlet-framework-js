package org.restlet.js.tests.resource;

import org.restlet.Application;
import org.restlet.ext.jackson.JacksonRepresentation;
import org.restlet.js.tests.model.Contact;
import org.restlet.resource.ClientResource;

public class ContactApplicationClientPut extends Application {

	public static void main(String[] args) {
		try {
			ClientResource clientResource = new ClientResource(
								"http://localhost:8182/contact/1");

			Contact contact = new Contact();
			contact.setId("1");
			contact.setLastName("Lastname");
			contact.setFirstName("Firstname");
			JacksonRepresentation<Contact> representation
					= new JacksonRepresentation<Contact>(contact);
			clientResource.put(representation);
		} catch(Exception ex) {}
	}
}
