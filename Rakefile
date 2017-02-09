require 'html-proofer'

task :default => [:build]

task :build do
  sh "bundle exec jekyll build"
end

task :test do 
  HTMLProofer.check_directory("./_site", {:allow_hash_href => true, :check_html => true, :check_external_hash => true, :typheous => {:timeout => 10}}).run
end
