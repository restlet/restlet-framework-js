package org.restlet.js.tests.resource;

import java.util.Map;

import org.restlet.ext.jackson.JacksonRepresentation;
import org.restlet.js.tests.model.Contact;
import org.restlet.js.tests.service.ContactService;
import org.restlet.js.tests.service.impl.ContactServiceImpl;
import org.restlet.representation.Representation;
import org.restlet.representation.Variant;
import org.restlet.resource.Get;
import org.restlet.resource.Put;
import org.restlet.resource.ServerResource;

public class SimpleContactServerResource
									extends ServerResource {
	private ContactService contactService
							= new ContactServiceImpl();

	@Get
	public Representation getContact(Variant variant) {
		System.out.println("1");
		Map<String, Object> attributes
							= getRequest().getAttributes();
		String contactId = (String) attributes.get("id");
		Contact contact = contactService.getContact(contactId);
		return new JacksonRepresentation<Contact>(contact);
	}

	@Put
	public Representation storeContact(Representation representation) {
		System.out.println("1");
		Contact contact = (new JacksonRepresentation<Contact>(
				representation, Contact.class)).getObject();
		contactService.storeContact(contact);
		return new JacksonRepresentation<Contact>(contact);
	}
}
