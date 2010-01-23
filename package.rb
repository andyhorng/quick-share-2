# require 'zip/zip'
require 'find'
require 'fileutils'

class Package

#  attr_reader
#  attr_writer 
  attr_accessor :items, :zip_path, :expired, :pwd

  def initialize(items = nil, zip_path = nil, pwd = nil, expired = nil)
    @items = items # directory or share_file
    @zip_path = zip_path
    @pwd = File.expand_path pwd
    @expired = expired
  end

  # def package
  #   @item_paths = get_all_item_path
  #   Zip::ZipFile.open(@zip_path, Zip::ZipFile::CREATE) do |z|
  #     @item_paths.each do |i|
  #       name = i.sub(@root_path, "")
  #       name[0] = "" if name[0] == '/'
  #       z.add(name, i)
  #     end
  #   end
  # end

  def package
    `cd #{@pwd}; \
      7z a -t7z -mx=0 #{zip} #{item_relative_paths.collect{|i| "'#{i}'"}.join(' ')} > /tmp/7z.log; \
      echo 'rm #{zip}' | at now + #{@expired} hours;` 
      `cat /tmp/7z.log`
      # zip -r -0 #{@zip_path} #{item_relative_paths.collect{|i| "'#{i}'"}.join(' ')}; \
  end

  def item_relative_paths
    @items.collect {|path| path.sub(/^(#{@pwd}|)\//, "") }
  end

  def random_name
    length ||= 10
    begin
      o =  [('a'..'z'),('A'..'Z')].map{|i| i.to_a}.flatten  
      rn = (0..length).map{ o[rand(o.length)]  }.join
    end until Dir.entries(@zip_path).find {|n| n.include? rn} == nil
    rn
  end

  def zip
    File.join(@zip_path, random_name + '.7z')
  end


  # def get_all_item_path
  #   all = []
  #   @items.each do |i|
  #     Find.find(i.path) { |p| all << p }
  #   end
  #   all
  # end

  # def aggregate_files(to)
  #   FileUtils.cp_r @items.collect{|i| i.path}, to if File.directory? to
  # end


end
