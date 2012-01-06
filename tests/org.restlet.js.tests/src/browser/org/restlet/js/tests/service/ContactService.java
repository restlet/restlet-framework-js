package org.restlet.js.tests.service;

import org.restlet.js.tests.model.Contact;

public interface ContactService {
	Contact getContact(String contactId);
	void storeContact(Contact contact);
}
