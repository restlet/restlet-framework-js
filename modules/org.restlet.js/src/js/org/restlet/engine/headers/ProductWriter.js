var ProductWriter = new Class({});

ProductWriter.extend({
    write: function(products) {
        var builder = new StringBuilder();

        for (var i=0; i<products.length; i++) {
            var product = products[i];

            if ((product.getName() == null)
                    || (product.getName().length == 0)) {
                throw new Error("Product name cannot be null.");
            }

            builder.append(product.getName());

            if (product.getVersion() != null) {
                builder.append("/").append(product.getVersion());
            }

            if (product.getComment() != null) {
                builder.append(" (").append(product.getComment()).append(")");
            }

            if (i!=products.length-1) {
                builder.append(" ");
            }
        }

        return builder.toString();
    }
});