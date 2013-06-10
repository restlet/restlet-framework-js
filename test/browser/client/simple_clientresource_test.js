describe('karma', function(){
  it('should be awesome', function(){
    var cr = new ClientResource("http://www.google.com");
    cr.get(function(representation) {
      //alert("1");
      expect('foo').to.be.a('string1');
    });
  });
});