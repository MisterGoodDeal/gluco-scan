require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'GlucoWidgetBridge'
  s.version        = package['version']
  s.summary        = 'Widget bridge for GlucoScan'
  s.description    = 'Widget bridge for GlucoScan'
  s.license        = { :type => 'MIT' }
  s.author         = 'GlucoScan'
  s.homepage       = 'https://github.com'
  s.platforms      = { :ios => '16.2' }
  s.swift_version  = '5.4'
  s.source         = { :git => 'https://github.com' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }
  s.source_files = '**/*.swift'
end
