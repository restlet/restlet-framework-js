package org.restlet.js.tests.resource;

import org.restlet.Application;
import org.restlet.ext.jackson.JacksonRepresentation;
import org.restlet.js.tests.model.Contact;
import org.restlet.representation.Representation;
import org.restlet.resource.ClientResource;

public class ContactApplicationClientGet extends Application {
	public static void main(String[] args) {
		try {
			ClientResource clientResource = new ClientResource(
								"http://localhost:8182/contact/1");
			Representation representation = clientResource.get();
			Contact contact = (new JacksonRepresentation<Contact>(
							representation, Contact.class)).getObject();
			System.out.println(contact.getId()
					+" - "+contact.getLastName()+" "+contact.getFirstName());
		} catch(Exception ex) {}
	}
}
