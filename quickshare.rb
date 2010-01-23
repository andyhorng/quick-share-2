require 'rubygems'
require 'sinatra'
require 'erb'
require 'json'

require 'package'

set :qsroot, '/home/ape'

before do 
  content_type :html, :charset => 'utf-8'
  if session[:login].nil?
    session[:login] = false
  end

=begin
  allow_page = ['/qs']
  allow_pattern = [/^\/css.*/, /^\/javascript.*/]

  allow = []
  allow.concat allow_page.find_all { |path| request.path_info == path }
  allow.concat allow_pattern.find_all { |pattern| request.path_info =~ pattern }

  if allow.empty? and session[:login] == false
    status 404
  end
=end


end

# login
get '/qs' do
  session[:login] = false
  erb :login
end


post '/qs/i' do

  if params[:code] == 'andy'
    session[:login] = true
  end

  if session[:login]
    erb :index
  else
    status 404
  end
end

post '/qs/list' do
  json = Dir.entries(File.join(options.qsroot, params[:path])).find_all{|e| e =~ /^[^.].*/}.collect do |entry|
    dir = 0
    if File.directory? File.join(options.qsroot, params[:path], entry)
      dir = 1
    end
    [File.join(params[:path], entry), dir]
  end.to_json
  json
end

helpers do
end


post '/qs/package' do
  puts params[:paths]
  puts JSON.parse(params[:paths])
  package = Package.new(JSON.parse(params[:paths]),
                        "/tmp", 
                        options.qsroot, 10 )
  puts package.item_relative_paths
  puts 'zip: ' + package.zip
  # puts package.package
  package.zip
end

