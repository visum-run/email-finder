const psl = require('psl')
const axios = require('axios')

module.exports.findEmail = async function (employee, callback) { // employee have to be firstName, lastName & website

	var employeesEnriched = []


	// Lower case for all parameter & init initial
	var fn = employee?.first_name?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
	var ln = employee?.last_name?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  var regexDomain = /(https?\:\/\/(www\.)?)?([^\/,\s]+\.[^\/,\s]+?)(?=\/|,|\s|$|\?|#)/g;
  var domainNotParsed = employee?.website?.toLowerCase().trim();
  var matchDomain = regexDomain.exec(domainNotParsed)
  var parsed = psl.parse(matchDomain[3]);
  var domain = parsed.domain;
	var fi = fn[0]
	var li = ln[0]

	// The most emails patterns used (add more patterns if needed)
	emails = [
		fn + '.' + ln + '@' + domain,
		fn + '@' + domain,
		fi + ln + '@' + domain,
		fi + '.' + ln + '@' + domain,
		fn + li + '@' + domain,
		fn + '.' + li + '@' + domain,
		fi + li + '@' + domain,
		fi + '.' + li + '@' + domain,
		ln + fn + '@' + domain,
		ln + '.' + fn + '@' + domain,
		ln + fi + '@' + domain,
		ln + '.' + fi + '@' + domain,
		li + fn + '@' + domain,
		li + '.' + fn + '@' + domain,
		fn + ln + '@' + domain,
	]


  for (let i = 0; i < emails.length; i++) {
    var url = 'https://isitarealemail.com/api/email/validate?email=' + emails[i]

    var options = {
      headers: {
        'Authorization': 'bearer ' + process.env.ISREALEMAIL_API
      }
    }

		var res = await axios.get(url, options)

		console.log(res.data)
    console.log(emails[i])

		if (res?.data?.status == 'valid') {
			employee.email = emails[i]
      break;
		}
  }

	callback(null, {
		success: true,
		employee: employee,
	});

};
