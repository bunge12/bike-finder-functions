module.exports = async function (context, req) {
  //   context.log("JavaScript HTTP trigger function processed a request.");
  //   context.log(req.body);
  //   const name = req.query.name || (req.body && req.body.name);
  //   const responseMessage = name
  //     ? "Hello, " +
  //       name +
  //       ". This HTT P triggered function executed successfully."
  //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

  //   context.res = {
  //     // status: 200, /* Defaults to 200 */
  //     body: responseMessage,
  //   };

  try {
    if (!req.body) throw new Error("no request body found");
  } catch (error) {
    context.res = {
      status: 500,
      body: error.message,
    };
  }
};
