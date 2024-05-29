const plugin = require('eslint-plugin-tech-radar');
const radar = require('./dependency-radar.json');

module.exports = [{
  'files': ['*.json'],
  'plugins': {
  	'tech-radar': plugin,
  },
  'languageOptions': {
  	'parser': plugin,
  },
	'rules': {
		'tech-radar/latest': [
			'error',
			{
				'packages': [
					'eslint-config-acuminous-shared'
				]
			}
		],
		'tech-radar/adherence': [
			'error',
			{
			  ...radar,
  		}
		]
	}
}]
