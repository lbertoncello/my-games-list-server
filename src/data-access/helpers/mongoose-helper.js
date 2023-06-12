export const MongooseHelper = {
  map(document) {
    if (document) {
      const { _id, __v, ...documentWithoutId } = document;

      return Object.assign({}, { id: _id.toString() }, documentWithoutId);
    }

    return null;
  },

  mapAll(documents) {
    const mappedDocuments = documents.map((document) => this.map(document));

    return mappedDocuments;
  },
};
