task :default => [:build]

task :build do
  sh "bundle exec jekyll build"
end

task :test => ':build' do 
	HTML::Proofer.new("./_site", {:disable_external => true, :check_html => true}).run
end
