package org.restlet.js.tests.service.impl;

import org.restlet.js.tests.model.Contact;
import org.restlet.js.tests.service.ContactService;

public class ContactServiceImpl implements ContactService {

	public Contact getContact(String contactId) {
		Contact contact = new Contact();
		contact.setId("1");
		contact.setLastName("LastName");
		contact.setFirstName("FirstName");
		return contact;
	}

	public void storeContact(Contact contact) {
		System.out.println("[server] "+contact.getId()
				+" - "+contact.getLastName()+" "+contact.getFirstName());
	}

}
