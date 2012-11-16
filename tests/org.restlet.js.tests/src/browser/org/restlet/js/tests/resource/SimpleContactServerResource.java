package org.restlet.js.tests.resource;

import java.util.Map;

import org.restlet.data.Cookie;
import org.restlet.ext.jackson.JacksonRepresentation;
import org.restlet.js.tests.model.Contact;
import org.restlet.js.tests.service.ContactService;
import org.restlet.js.tests.service.impl.ContactServiceImpl;
import org.restlet.representation.Representation;
import org.restlet.representation.Variant;
import org.restlet.resource.Get;
import org.restlet.resource.Put;
import org.restlet.resource.ServerResource;
import org.restlet.util.Series;

public class SimpleContactServerResource
									extends ServerResource {
	private ContactService contactService
							= new ContactServiceImpl();

	
	
	@Get
	public Representation getContact(Variant variant) {
		System.out.println("1 - default");
		displayCookies();
		Map<String, Object> attributes
							= getRequest().getAttributes();
		String contactId = (String) attributes.get("id");
		Contact contact = contactService.getContact(contactId);
		return new JacksonRepresentation<Contact>(contact);
	}

	private void displayCookies() {
		Series<Cookie> cookies = getRequest().getCookies();
		System.out.println("Cookies:");
		for (Cookie cookie : cookies) {
			System.out.println("- "+cookie.getName()+", "+cookie.getValue());
		}
	}

	@Get("json")
	public Representation getContactJson(Variant variant) {
		System.out.println("1 - json");
		Map<String, Object> attributes
							= getRequest().getAttributes();
		String contactId = (String) attributes.get("id");
		Contact contact = contactService.getContact(contactId);
		return new JacksonRepresentation<Contact>(contact);
	}

	@Put
	public Representation storeContact(Representation representation) {
		System.out.println("2 - default");
		displayCookies();
		System.out.println("2 - representation = "+representation);
		/*try {
			System.out.println("content = "+representation.getText());
		} catch (IOException e) {
			e.printStackTrace();
		}*/
		Contact contact = (new JacksonRepresentation<Contact>(
				representation, Contact.class)).getObject();
		contactService.storeContact(contact);
		return new JacksonRepresentation<Contact>(contact);
	}

	@Put("json")
	public Representation storeContactJson(Representation representation) {
		System.out.println("2 - json");
		Contact contact = (new JacksonRepresentation<Contact>(
				representation, Contact.class)).getObject();
		contactService.storeContact(contact);
		return new JacksonRepresentation<Contact>(contact);
	}
}
