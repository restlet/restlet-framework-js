var commons = require("./commons.js");
var http = require("http");

// Client

#include org/restlet/engine/adapter/ClientCall.js#

#include org/restlet/engine/adapter/NodeJsHttpClientCall.js#

#include org/restlet/engine/adapter/ClientAdapter.js#

#include org/restlet/engine/adapter/HttpClientHelper.js#

#include org/restlet/engine/adapter/NodeJsHttpClientHelper.js#

// Server

#include org/restlet/engine/Helper.js#

#include org/restlet/engine/RestletHelper.js#

#include org/restlet/engine/ConnectorHelper.js#

#include org/restlet/engine/ServerHelper.js#

#include org/restlet/routing/Filter.js#

#include org/restlet/routing/Route.js#

#include org/restlet/routing/Router.js#

#include org/restlet/routing/Template.js#

#include org/restlet/routing/TemplateRoute.js#

#include org/restlet/routing/Variable.js#

#include org/restlet/routing/VirtualHost.js#

#include org/restlet/engine/CompositeHelper.js#

#include org/restlet/engine/util/CallResolver.js#

#include org/restlet/engine/util/MapResolver.js#

#include org/restlet/engine/util/ChildContext.js#

#include org/restlet/engine/component/ClientRoute.js#

#include org/restlet/engine/component/ClientRouter.js#

#include org/restlet/engine/component/ComponentContext.js#

#include org/restlet/engine/component/ComponentHelper.js#

#include org/restlet/engine/component/HostRoute.js#

#include org/restlet/engine/component/InternalRouter.js#

#include org/restlet/engine/component/ServerRouter.js#

#include org/restlet/engine/adapter/ServerCall.js#

#include org/restlet/engine/adapter/NodeJsHttpServerCall.js#

#include org/restlet/engine/adapter/ServerAdapter.js#

#include org/restlet/engine/adapter/HttpServerHelper.js#

#include org/restlet/engine/adapter/NodeJsHttpServerHelper.js#

/*var core = module.parent.exports["core"];
var engine = core.Engine.getInstance();
engine.getRegisteredClients().push(NodeJsHttpClientHelper);
engine.getRegisteredServers().push(NodeJsHttpServerHelper);*/

module.exports = {
	Header: Header,
	ContentType: ContentType,
	HeaderReaderUtils: HeaderReaderUtils,
	HeaderWriterUtils: HeaderWriterUtils,
	HeaderUtils: HeaderUtils,
	HeaderReader: HeaderReader,
	HeaderWriter: HeaderWriter,
	CacheDirectiveWriter: CacheDirectiveWriter,
	CookieReader: CookieReader,
	CookieWriter: CookieWriter,
	CookieSettingWriter: CookieSettingWriter,
	DateWriter: DateWriter,
	DimensionReader: DimensionReader,
	DimensionWriter: DimensionWriter,
	DispositionReader: DispositionReader,
	DispositionWriter: DispositionWriter,
	ExpectationReader: ExpectationReader,
	MetadataWriter: MetadataWriter,
	EncodingReader: EncodingReader,
	EncodingWriter: EncodingWriter,
	LanguageReader: LanguageReader,
	LanguageWriter: LanguageWriter,
	MethodWriter: MethodWriter,
	PreferenceReader: PreferenceReader,
	PreferenceWriter: PreferenceWriter,
	ProductWriter: ProductWriter,
	RangeReader: RangeReader,
	RangeWriter: RangeWriter,
	RecipientInfoReader: RecipientInfoReader,
	RecipientInfoWriter: RecipientInfoWriter,
	TagWriter: TagWriter,
	WarningReader: WarningReader,
	WarningWriter: WarningWriter,
	DateUtils: DateUtils,
	HttpRequest: HttpRequest,
	HttpResponse: HttpResponse,
	Call: Call,
	ClientCall: ClientCall,
	NodeJsHttpClientCall: NodeJsHttpClientCall,
	ClientAdapter: ClientAdapter,
	HttpClientHelper: HttpClientHelper,
	NodeJsHttpClientHelper: NodeJsHttpClientHelper,
	ComponentHelper: ComponentHelper,
	VirtualHost: VirtualHost,
	InternalRouter: InternalRouter
};