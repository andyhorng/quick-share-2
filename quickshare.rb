require 'rubygems'
require 'sinatra'
require 'erb'
require 'json'

set :qsroot, '/home/ape'

before do 
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

  puts "========"
  puts params[:path]
  puts "========"

  json = Dir.entries(File.join(options.qsroot, params[:path])).find_all{|e| e =~ /^[^.].*/}.collect do |entry|
    dir = false
    if File.directory? File.join(options.qsroot, params[:path], entry)
      dir = true
    end
    # 第一個不能是 / 
    puts File.join(params[:path], entry)
    [File.join(params[:path], entry), dir]
  end.to_json
  puts "json = " + json.inspect
  json
end

helpers do
end